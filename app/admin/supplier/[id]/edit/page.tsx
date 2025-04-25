"use client"

import { SupplierForm } from "@/components/admin/supplier/supplier-form"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { fetchData } from "@/utils/api-utils"
import { Suppliers } from "@/utils/types"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditSupplierPage() {
  const params = useParams()
  const supplierId = params.id as string

  const [supplier, setSupplier] = useState<Suppliers | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSupplier = async () => {
    try {
      const response = await fetchData<Suppliers>(`suppliers/${supplierId}`)
      setSupplier(response)
    } catch (error) {
      console.error("Error fetching supplier:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSupplier()
  }, [supplierId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Supplier not found</p>
      </div>
    )
  }

  return (
    <div className="md:p-6 p:2 space-y-6 border rouunded-sm">
      <div className="md:p-6 p:2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <CardTitle>Edit Supplier</CardTitle>
            <CardDescription>Update the supplier information.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/supplier/supplier-list">Back to Suppliers</Link>
          </Button>
        </div>
      </div>

      <SupplierForm mode="edit" supplier={supplier} />
    </div>
  )
}
