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

        setPhotos(response);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPhotos();
  }, []);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Carousel images={photos} />
    </div>
  )
}