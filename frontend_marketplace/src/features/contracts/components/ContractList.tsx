import type { Contrato } from "../models"
import { ContractCard } from "./ContractCard"

interface ContractListProps {
  contracts: Contrato[]
}

export function ContractList({ contracts }: ContractListProps) {
  if (contracts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No tienes contratos aún.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  )
}
