export default function() {
  return [
    {
      title: 'Categories',
      htmlBefore: '<i class="material-icons">&#xE8B9;</i>',
      items: [
        {
          title: 'User Profile',
          to: '/user-profile',
        },
        {
          title: 'Edit User Profile',
          to: '/edit-user-profile',
        },
        {
          title: 'Login',
          to: '/login',
        },
        {
          title: 'Register',
          to: '/register',
        },
        {
          title: 'Forgot Password',
          to: '/forgot-password',
        },
        {
          title: 'Reset Password',
          to: '/reset-password',
        },
      ],
    },
  ];
}
