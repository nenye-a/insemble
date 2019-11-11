export default function() {
  return [{
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
        title: "Overview",
        to: "/components-overview"
      },
      {
        title: "Blog Posts",
        to: "/blog-posts"
      }
    ]
  },
  {
    title: 'Pending Deals',
    to: '/no-deals',
    htmlBefore: '<i class="material-icons">edit</i>',
    htmlAfter: '',
  }];
}
