export default function () {
  return [ 
  {
    title: 'Category',
    items: [{
      title: 'Online Store',
      to: '/ecommerce',
      htmlBefore: '<i class="material-icons">&#xE8D1;</i>',
      htmlAfter: '',
    }],
  },
  {
    title: 'Demographic',
    items: [{
      title: 'Errors',
      htmlBefore: '<i class="material-icons">error</i>',
      to: '/errors',
    }],
  }, {
    title: 'Region',
    items: [{
      title: 'Overview',
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: '/components-overview',
    }],
  }, {
    title: 'Income',
  },{
    title: 'Population',
    items: [{
      title: 'Header Nav',
      htmlBefore: '<i class="material-icons">view_day</i>',
      to: '/header-navigation',
    }],
  }
  ];
}
