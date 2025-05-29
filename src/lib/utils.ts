export const generateURL = (subdomain: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `/shops/${subdomain}`
  }

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  return `https://${subdomain}.${domain}`
}

export const  formatNumber = (number: number | string) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}