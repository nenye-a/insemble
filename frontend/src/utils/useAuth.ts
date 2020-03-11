import { useContext } from 'react';
import { AuthContext } from '../core-ui/AuthorizationListener';

export default function useAuth() {
  return useContext(AuthContext);
}
