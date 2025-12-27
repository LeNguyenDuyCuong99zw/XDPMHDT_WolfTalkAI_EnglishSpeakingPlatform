import { storageService } from '../../../infrastructure/services/StorageService';

export class LogoutUseCase {
  execute(): void {
    // Clear all stored data
    storageService.clear();
    
    // Redirect to login
    window.location.href = '/login';
  }
}
