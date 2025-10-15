import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { userStore, signOut, isAuthenticatedStore } from '~/lib/stores/auth';
import { AuthModal } from './AuthModal';
import { toast } from 'react-toastify';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function UserMenu() {
  const user = useStore(userStore);
  const isAuthenticated = useStore(isAuthenticatedStore);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-4 py-2 bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text rounded-md transition-colors text-sm"
        >
          Sign In
        </button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary transition-colors">
          <div className="i-ph:user-circle-duotone text-xl" />
          <span className="text-sm">{user?.email?.split('@')[0]}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md shadow-lg p-1 z-50"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="px-3 py-2 text-sm text-bolt-elements-textSecondary outline-none cursor-default"
            disabled
          >
            {user?.email}
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-[1px] bg-bolt-elements-borderColor my-1" />
          <DropdownMenu.Item
            className="px-3 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3 rounded cursor-pointer outline-none"
            onClick={handleSignOut}
          >
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
