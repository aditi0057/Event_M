export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Events',
      route: '/Events',
    },
    {
      label: 'Calendar',
      route: '/Calendar',
    },
    {
      label: 'Polls',
      route: '/Poll',
    },
    {
      label: 'Gallery',
      route: '/Gallery',
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
  