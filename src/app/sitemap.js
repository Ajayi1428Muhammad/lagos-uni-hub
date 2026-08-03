import React from 'react'

const sitemap = () => {
    const baseUrl = "http://luhub.vercel.app";
    const routes = [
      "",
      "/sell",
      "/signin",
      "/signup",
      "/affiliates",
    ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  })) ;
  return [...routes];
}

export default sitemap
