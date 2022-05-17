import { type } from '@testing-library/user-event/dist/type';
import axios from 'axios';
import { rm } from 'fs';
import React, { useEffect, useState } from 'react';

type Response = {
  images: ImageResponse[],
}

type ImageResponse = {
  id: number,
  source_url: string,
  view_url: string,
  representations: ImageRepresentations,
  thumbnails_generated: boolean,
  name: string,
  format: ImageFormat,
}

type ImageFormat = "gif" | "jpg" | "jpeg" | "png" | "svg" | "webm"

type ImageRepresentations = {
  full: string,
  large: string,
  medium: string,
  small: string,
  tall: string,
  thumb: string,
  thumb_small: string,
  thumb_tiny: string,
}

type ImageProps = {
  image: ImageResponse
}

const Image: React.FC<ImageProps> = ({image}) => {

  if (image.thumbnails_generated === false) {
    return (
      <div style={{
        display: 'inline-block',
        width: '100px',
        height: '100px',
        backgroundColor: '#ccc'
      }}>
        {"Loading..."}
      </div>
    )
  }

  if (image.format === 'webm') {
    return (
      <video autoPlay={false} width='100px' height='100px'>
        <source src={image.representations.thumb_tiny}/>
      </video>
    );
  }

  if (image.format === 'svg') {
    return (
      <div style={{
        display: 'block',
        width: '100px',
        height: '100px',
        backgroundColor: '#cff'
      }}>
        {image.format}
      </div>
    )
  }

  return (
    <img src={image.representations.thumb_tiny} alt={image.name} loading="lazy" style={{
      display: 'block',
      width: '100px',
      height: '100px',
      objectFit: 'cover'
    }} />
  );
}

function App() {
  const [resp, setResp] = useState<ImageResponse[]>([]);

  const getPages = (count: number) => {
    let list: number[] = [];
    for (let i = 1; i <= count; i++) {
      list.push(i);
    }
    return list;
  }

  useEffect(() => {
    getPages(10).map(page => {
      axios.get<Response>(`https://derpibooru.org/api/v1/json/search/images?q=safe&per_page=50&page=${page}`).then(r => {
        setResp((rm) => addNewImages(rm, r.data.images));
      })
    })
  }, [])

  return (
    <div className="App">
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {resp.map(i =>
          <Image image={i} key={i.id} />
        )}
      </div>
    </div>
  );
}

function addNewImages(imageList: ImageResponse[], newImages: ImageResponse[]) {
  return [...imageList, ...newImages.filter(img => !imageList.map(i => i.id).includes(img.id))];
}

export default App;
