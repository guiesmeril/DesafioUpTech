import React, { useState } from 'react';
import './App.css';
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner
} from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import BookCard from './BookCard.jsx';

function App() {
  //States
  const [maxResultado, setMaxResultado] = useState(10);
  const [inicioIndex, setInicioIndex] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  //Handle Procurar
  const handleSubmit = () => {
    setLoading(true);
    if (maxResultado > 40 || maxResultado < 1) {
      toast.error('Máximo Resultado fora do permitido, inserir entre 1 até 40.');
    } else {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResultado}&startIndex=${inicioIndex}`
        )
        .then(res => {
          if (inicioIndex >= res.data.totalItems || inicioIndex < 1) {
            toast.error(
              `Favor inserir um valor entre 1 até ${res.data.totalItems}`
            );
          } else {
            if (res.data.items.length > 0) {
              setCards(res.data.items);
              setLoading(false);
            }
          }
        })
        .catch(err => {
          setLoading(true);
          console.log(err.response);
        });
    }
  };

  const mainHeader = () => {
    return (
      <div className='main-image d-flex justify-content-center align-items-center flex-column'>
        {/*  Overlay */}
        <div className="filter"></div>
        <h1 className='display-2 text-center text-white mb-3' style={{ zIndex: 2 }}>
          Desafio UpTech
          </h1>
        <div style={{ width: '60%', zIndex: 2 }}>
          <InputGroup size='lg' className='mb-3'>
            <Input placeholder='Buscar Livro'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <InputGroupAddon addonType='append'>
              <Button color='secondary' onClick={handleSubmit}>
                <i className='fas fa-search'></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <div className='d-flex text-white justify-content-center'>
            <FormGroup className='ml-5' >
              <Label for='maxResultado'>Máximo Resultado</Label>
              <Input
                type='number'
                id='maxResultado'
                placeholder='Máximo Resultado'
                value={maxResultado}
                onChange={e => setMaxResultado(e.target.value)}
              />
            </FormGroup>
            <FormGroup className='ml-5' >
              <Label for='inicioIndex'>Inicio Index</Label>
              <Input
                type='number'
                id='inicioIndex'
                placeholder='Inicio Index'
                value={inicioIndex}
                onChange={e => setInicioIndex(e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    );
  };

  const handleCards = () => {
    if (loading) {
      return (
        <div className='d-flex justify-content-center mt-3'>
           <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else {
      const items = cards.map((item, i) => {
        let thumbnail = '';
        if (item.volumeInfo.imageLinks) {
          thumbnail = item.volumeInfo.imageLinks.thumbnail;
        }
        return (
          <div className='col-lg-4 mb-3' key={item.id}>
            <BookCard
              thumbnail={thumbnail}
              title={item.volumeInfo.title}
              pageCount={item.volumeInfo.pageCount}
              language={item.volumeInfo.language}
              authors={item.volumeInfo.authors}
              publisher={item.volumeInfo.publisher}
              description={item.volumeInfo.description}
              previewLink={item.volumeInfo.previewLink}
              infoLink={item.volumeInfo.infoLink}
            />
          </div>
        );
      });
      return (
        <div className='container my-5'>
          <div className='row'>{items}</div>
        </div>
      );
    }
  };
  return (
    <div className='w-100 h-100'>
      {mainHeader()}
      {handleCards()}
      <ToastContainer />
    </div>
  );
}
export default App;