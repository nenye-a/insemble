export default function () {
  return [{
    title: 'Dashboard', 
    items: [{
      title: 'Explore',
      to: '/explore',
      htmlBefore: '<i class="material-icons">&#xE917;</i>',
      htmlAfter: '',
    }, {
      title: 'Find Tenants',
      to: '/find-tenants',
      htmlBefore: '<i class="material-icons">&#xE8D1;</i>',
      htmlAfter: '',
    },
    {
      title: "My Spaces",
      htmlBefore: '<i class="material-icons">view_module</i>',
      items: [
        {
          title: "Main",
          to: "/tenant-deep-dive"
        }
      ]
    },
    {
      title: 'Pending Deals',
      to: '/no-deals',
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: '',
    }],
  }];
}
