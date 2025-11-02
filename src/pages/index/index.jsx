export default function Index() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await IndexAPI.getCarouselPhotos();
        setPhotos(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <div>
      {photos.map((photo) => (
        <div key={photo.id}>
          <img src={photo.url} alt={photo.title} />
        </div>
      ))}
    </div>
  )
}