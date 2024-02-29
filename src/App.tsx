import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import env from 'react-dotenv';
import Select from 'react-select';

type Quote = {
  quote: string;
  author: string;
  category: string;
};

type Item = {
  label: string;
  value: number;
};

const Categories: string[] = [
  'Age',
  'Alone',
  'Amazing',
  'Anger',
  'Architecture',
  'Art',
  'Attitude',
  'Beauty',
  'Best',
  'Birthday',
  'Business',
  'Car',
  'Change',
  'Communication',
  'Computers',
  'Cool',
  'Courage',
  'Dad',
  'Dating',
  'Death',
  'Design',
  'Dreams',
  'Education',
  'Environmental',
  'Equality',
  'Experience',
  'Failure',
  'Faith',
  'Family',
  'Famous',
  'Fear',
  'Fitness',
  'Food',
  'Forgiveness',
  'Freedom',
  'Friendship',
  'Funny',
  'Future',
  'God',
  'Good',
  'Government',
  'Graduation',
  'Great',
  'Happiness',
  'Health',
  'History',
  'Home',
  'Hope',
  'Humor',
  'Imagination',
  'Inspirational',
  'Intelligence',
  'Jealousy',
  'Knowledge',
  'Leadership',
  'Learning',
  'Legal',
  'Life',
  'Love',
  'Marriage',
  'Medical',
  'Men',
  'Mom',
  'Money',
  'Morning',
  'Movies',
  'Success'
];

const options: Item[] = [
  {
    value: 0,
    label: 'Random',
  },
];

const getQuote = async (category: string): Promise<Quote> => {
  if (category === 'random') {
    console.log('vale', Math.random() % Categories.length);
    category = Categories[1];
  }
  try {
    const query = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category.toLowerCase()}`,
    {
      method: 'GET',
      headers: {
        'x-api-key': env.NINJA_API_KEY,
      },
    })
    if (!query.ok) {
      throw new Error('Failed to retrieve quote');
    }

    const result = await query.json();
    console.log(result[0]);
    return result[0];
  } catch (err) {
    console.error('Error fetching quote:', err);
    return {quote: '', author: '', category: ''};
  }
};

function App() {
  const [quote, setQuote] = useState<Quote>({
    quote: '',
    author: '',
    category: '',
  });
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const assembleOptions = () => {
      Categories.forEach((item: string, index: number) => {
        options.push(Object.assign({
          value: index + 1,
          label: item,
        }));
      });
    };

    assembleOptions();
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      const newQuote = await getQuote('random');
      setQuote(newQuote);
    };

    fetchQuote();
    return () => {};
  }, []);

  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black'
    }),
    control: (provided: any) => ({
      ...provided,
      color: 'white',
      minWidth: '200px',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'black'
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='Selector'>
          <Select isSearchable={false} defaultValue={options[0]}
            styles={{...customStyles}}
            options={options}
            onChange={(newVal) => {
              if (newVal) setValue(newVal.label)
            }}
        />
        </div>
        <div className="Quote-text">
          {quote?.quote}
        </div>
        <div className="Quote-text" style={{marginTop: '3%', fontWeight: 'bold'}}>
          - {quote?.author}
        </div>
        <button onClick={async () => {
            const newQuote = await getQuote(value);

            if (newQuote.quote !== '') setQuote(newQuote);
          }} style={{
          position: 'absolute',
          cursor: 'pointer',
          bottom: '20vh',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          border: '2px solid white',
          padding: '10px',
          borderRadius: '12px',
          fontSize: 20,
          color: '#fff',
        }}>
          Generate !
        </button>
      </header>
    </div>
  );
}

export default App;
