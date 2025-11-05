import IndexAPI from "@/api/indexAPI";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Carousel from "@/components/carousel";

export default function Index() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await IndexAPI.getCarouselPhotos();
        console.log(response);
        setPhotos(response);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPhotos();
  }, []);


  return (
    <div>
      <Carousel images={photos} />
    </div>
  )
}