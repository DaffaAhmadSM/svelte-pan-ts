export const infiniteScroll = ({ fetch, element }) => {
    if (element) {
      const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting){
            fetch()
        }
      });
  
      observer.observe(element);
    }
  };