"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="large"
      type="submit"
      isLoading={pending}
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
