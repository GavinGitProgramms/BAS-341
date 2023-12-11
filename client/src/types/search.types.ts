export type SortDirection = 'asc' | 'desc'

export type EntitySearchOptions = {
  page: number
  rowsPerPage: number
  sortField: string
  sortDirection: SortDirection
}

export type SearchContext = {
  user: string
}

export type SearchResults<T> = {
  total: number
  results: T[]
}
