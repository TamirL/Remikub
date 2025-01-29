import type { RealCardData } from "../domain/card";

export const currentlyDraggedCardState = $state<{ draggedCard: RealCardData | null }>({ draggedCard: null })