import { AppDataSource } from '../data-source'

/**
 * Ensures that the AppDataSource is initialized before proceeding with the function execution.
 *
 * If the AppDataSource is not initialized, it will be initialized before continuing.
 *
 * @returns Promise that resolves when the AppDataSource is initialized.
 */
export async function ensureInitialized(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
}
