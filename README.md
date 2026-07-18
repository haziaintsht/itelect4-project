# Complaint Impact

A web-based complaint management and record system developed for the LTO Lipa Regional Office and the Lipa Traffic Management and Transport Office. It is designed to handle complaints specifically involving registered tricycle operators and drivers, as tricycles are a common form of public transport in Lipa City. 

The system features an administrative dashboard for authorized personnel to track records, while tricycle operators are notified of complaints via SMS. The platform operates locally without integrating with national LTO databases or external systems, serving as an internal digital tool for authorized staff.

## Blueprints Defined (`types/index.ts`)
- **Core Entities**: `User` (System roles), `Tricycle` (Vehicle registries), `Complaint` (Log files)
- **Generic Interface**: `ApiResponse<T>` (Flexible backend data transport shell)
- **Utility Mapped Types**: `ComplaintUpdate` (`Partial<T>`), `PublicTricycleView` (`Omit<T,K>`), `StatusCounts` (`Record<K,T>`)
- **Enums**: `ComplaintStatus` (Regular Enum), `Role` (Const Enum)

## Installation & Execution Setup

1. Install project dependencies:
   ```bash
   npm install