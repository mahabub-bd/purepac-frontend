"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { fetchData, fetchProtectedData, patchData } from "@/utils/api-utils";
import { MenuItem, Role } from "@/utils/types";
import { ChevronDown, ChevronRight, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface MenuPermission {
  id: number;
  roleId: number;
  menuId: number;
  canView: boolean;
  menu: {
    id: number;
    name: string;
    isAdminMenu: boolean;
  };
  role: {
    id: number;
    rolename: string;
  };
}

export default function RoleMenuPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>(
    {}
  );
  const [menuPermissions, setMenuPermissions] = useState<
    Record<number, boolean>
  >({});
  const [loading, setLoading] = useState(false);
  const [savingMenuId, setSavingMenuId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Separate menus into admin and user panels
  const { adminMenus, userMenus } = useMemo(() => {
    const adminMenus: MenuItem[] = [];
    const userMenus: MenuItem[] = [];

    const categorizeMenus = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.isAdminMenu) {
          adminMenus.push(item);
        } else {
          userMenus.push(item);
        }
      });
    };

    if (menuTree.length > 0) {
      categorizeMenus(menuTree);
    }

    return { adminMenus, userMenus };
  }, [menuTree]);

  // Memoized filtered menu tree for both panels
  const { filteredAdminMenus, filteredUserMenus } = useMemo(() => {
    if (!searchTerm) {
      return {
        filteredAdminMenus: adminMenus,
        filteredUserMenus: userMenus,
      };
    }

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .map((item) => {
          const matches = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const filteredChildren = item.children?.length
            ? filterItems(item.children)
            : [];

          if (matches || filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          return null;
        })
        .filter(Boolean) as MenuItem[];
    };

    return {
      filteredAdminMenus: filterItems([...adminMenus]),
      filteredUserMenus: filterItems([...userMenus]),
    };
  }, [adminMenus, userMenus, searchTerm]);

  // Check if the selected role is a customer role
  const isCustomerRole = useMemo(() => {
    return selectedRole?.rolename.toLowerCase().includes("customer");
  }, [selectedRole]);

  // Fetch roles and menu tree on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesData, menuData] = await Promise.all([
          fetchData("roles") as Promise<Role[]>,
          fetchData("menu/tree") as Promise<MenuItem[]>,
        ]);

        if (rolesData) setRoles(rolesData);
        if (menuData) {
          setMenuTree(menuData);
          // Expand all main menus by default
          const initialExpandedState = menuData.reduce((acc, item) => {
            if (item.isMainMenu) acc[item.id] = true;
            return acc;
          }, {} as Record<number, boolean>);
          setExpandedMenus(initialExpandedState);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data. Please try again.");
      }
    };

    fetchInitialData();
  }, []);

  // Set selected role when role ID changes
  useEffect(() => {
    if (selectedRoleId && roles.length > 0) {
      const role = roles.find((r) => r.id.toString() === selectedRoleId);
      setSelectedRole(role || null);
    } else {
      setSelectedRole(null);
    }
  }, [selectedRoleId, roles]);

  // Fetch menu permissions when role is selected
  useEffect(() => {
    if (!selectedRoleId || menuTree.length === 0) return;

    const fetchMenuPermissions = async () => {
      setLoading(true);
      try {
        const response = (await fetchProtectedData(
          `menu-permissions/role/${selectedRoleId}`
        )) as MenuPermission[];

        const newPermissions: Record<number, boolean> = {};

        // Initialize all permissions as false first
        const initializePermissions = (items: MenuItem[]) => {
          items.forEach((item) => {
            newPermissions[item.id] = false;
            if (item.children?.length) initializePermissions(item.children);
          });
        };
        initializePermissions(menuTree);

        // Update with actual permissions from API
        response?.forEach((permission) => {
          newPermissions[permission.menuId] = permission.canView;
        });

        setMenuPermissions(newPermissions);
      } catch (error) {
        console.error("Error fetching menu permissions:", error);
        toast.error("Failed to load menu permissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuPermissions();
  }, [selectedRoleId, menuTree]);

  const toggleMenuExpand = (menuId: number) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handlePermissionChange = async (menuId: number, canView: boolean) => {
    if (!selectedRoleId) {
      toast.error("Please select a role first");
      return;
    }

    setSavingMenuId(menuId);
    try {
      const response = await patchData(
        `menu-permissions/${selectedRoleId}/${menuId}`,
        { canView }
      );

      if (response?.statusCode === 200) {
        setMenuPermissions((prev) => ({ ...prev, [menuId]: canView }));
        toast.success(
          `Permission ${canView ? "granted" : "revoked"} successfully`
        );
      } else {
        throw new Error(response?.message || "Failed to update permission");
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("Failed to update permission. Please try again.");
    } finally {
      setSavingMenuId(null);
    }
  };

  const handleExpandAll = (expand: boolean) => {
    const newExpandedState: Record<number, boolean> = {};

    const processItems = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.children?.length) {
          newExpandedState[item.id] = expand;
          processItems(item.children);
        }
      });
    };

    processItems(menuTree);
    setExpandedMenus(newExpandedState);
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children?.length > 0;
    const isExpanded = expandedMenus[item.id] ?? false;
    const isLoading = savingMenuId === item.id;

    return (
      <div key={item.id} className="w-full">
        <div
          className={`flex items-center justify-between py-2 px-2 sm:px-3 md:px-4 hover:bg-muted/50 rounded-md ${
            depth > 0 ? "ml-3 sm:ml-4 md:ml-6" : ""
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 flex-shrink-0"
                onClick={() => toggleMenuExpand(item.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium truncate">{item.name}</span>
          </div>
          <div className="flex items-center ml-1 sm:ml-2 flex-shrink-0">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Switch
                checked={menuPermissions[item.id] ?? false}
                onCheckedChange={(checked) =>
                  handlePermissionChange(item.id, checked)
                }
                disabled={!selectedRoleId || loading}
              />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l ml-2 sm:ml-3 pl-1 sm:pl-2 mt-1">
            {item.children.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderPanel = (isAdminPanel: boolean) => {
    const menus = isAdminPanel ? filteredAdminMenus : filteredUserMenus;
    const panelName = isAdminPanel ? "Admin Panel" : "User Panel";
    const searchPlaceholder = isAdminPanel
      ? "Search admin menus..."
      : "Search user menus...";
    const noResultsMessage = searchTerm
      ? `No ${panelName.toLowerCase()} menus match your search`
      : `No ${panelName.toLowerCase()} menus available`;

    return (
      <div className="border rounded-sm md:p-6 p-2">
        <div className="bg-muted py-2 sm:py-3 px-2 sm:px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 gap-2 sm:gap-0">
          <div className="flex items-center">
            <span className="font-medium mr-2 sm:mr-4 text-sm sm:text-base">
              {panelName} Menu
            </span>
            <div className="relative ml-2 sm:ml-4 flex-1 sm:flex-none">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="pl-6 sm:pl-8 h-7 sm:h-8 rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-normal gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExpandAll(true)}
              className="text-xs h-7 sm:h-8 px-2 sm:px-3"
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExpandAll(false)}
              className="text-xs h-7 sm:h-8 px-2 sm:px-3"
            >
              Collapse All
            </Button>
            <span className="font-medium ml-2 sm:ml-4 text-sm sm:text-base">
              Can View
            </span>
          </div>
        </div>
        <div className="">
          {menus.length > 0 ? (
            <div className="p-1 sm:p-2">
              {menus.map((item) => renderMenuItem(item))}
            </div>
          ) : (
            <div className="py-6 sm:py-8 text-center text-muted-foreground text-sm sm:text-base">
              {noResultsMessage}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-full p-2 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
          Role Menu Permissions
        </h1>
        <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
          Assign menu permissions to different roles. Select a role and toggle
          menu visibility.
        </p>

        <div className="mb-4 sm:mb-6">
          <label className="text-sm font-medium mb-1 sm:mb-2 block">
            Select Role
          </label>
          <Select
            value={selectedRoleId}
            onValueChange={setSelectedRoleId}
            disabled={roles.length === 0}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.rolename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-6 sm:py-8">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
          <span className="ml-2 text-sm sm:text-base">
            Loading permissions...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedRoleId && (
            <>
              {/* Render Admin Panel for non-customer roles */}
              {!isCustomerRole && renderPanel(true)}

              {/* Render User Panel only for customer roles */}
              {isCustomerRole && renderPanel(false)}
            </>
          )}

          {!selectedRoleId && (
            <div className="border rounded-md p-6 text-center text-muted-foreground">
              Please select a role to view and manage permissions
            </div>
          )}
        </div>
      )}
    </div>
  );
}
