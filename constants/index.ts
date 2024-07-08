export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Events',
      route: '/events/create',
    },
    {
      label: 'Calendar',
      route: '/calendar',
    },
    {
      label: 'Polls',
      route: '/polls',
    },
    {
      label: 'Gallery',
      route: '/gallery',
    },
  ]
  
  export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: '',
    price: '',
    isFree: false,
    url: '',
  }
  