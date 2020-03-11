import { useContext } from 'react';
import { AuthContext } from '../core-ui/AuthorizationProvider';

export default function useAuth() {
  return useContext(AuthContext);
}
