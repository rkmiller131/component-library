/*
This carousel requires a minimum of 3 items and only displays 3 at a time, but can support any number above 3.
*/

import { useEffect, useRef, useState } from "react";
import { gsap } from 'gsap';

import './styles/TriOffsetCarousel.css';

const exampleCards = [
  {
    id: 0, // This carousel matches the index to the current card id
    graphic: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/howToPlayAbduction.webm?v=1725386211408'
  },
  {
    id: 1,
    graphic: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/howToPlayFlexion.webm?v=1725386216617'
  },
  {
    id: 2,
    graphic: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/howToPlayAdduction.webm?v=1725386214468'
  }
];

interface CarouselItemProps {
  currentIndex: number;
  card: {
    id: number;
    graphic: string;
  };
}

// -----------------------------------------------------------------------------------------------------

export function TriOffsetCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0); // the center card
  const [cards, setCards] = useState(exampleCards.slice(0, 3));
  const carouselRef = useRef<HTMLDivElement>(null);
  const [pauseCarousel, setPauseCarousel] = useState(false);

  useEffect(() => {
    if (pauseCarousel) return;
    const automaticScroll = setInterval(() => {
        // because setInterval captures the intial state in a closure variable from its cb fn,
        // need to make sure we grab prev and not remain stagnant at that one val.
        setCurrentIndex(prev => (prev + 1) % exampleCards.length);
    }, 3000);

    return () => clearInterval(automaticScroll);
  }, [pauseCarousel]);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;

    const newIndex = (currentIndex + 1) % exampleCards.length;
    const lastIndex = newIndex + 1 === exampleCards.length ? 0 : newIndex + 1 === exampleCards.length + 1 ? newIndex : newIndex + 1;
    const firstIndex = newIndex - 1 >= 0 ? newIndex - 1 : exampleCards.length - 1;

    const newCards = [exampleCards[firstIndex], exampleCards[newIndex], exampleCards[lastIndex]];
    setCards(newCards);

    const hoverIn = () => setPauseCarousel(true);
    const hoverOut = () => {
        setPauseCarousel(false);
        setCurrentIndex(prev => (prev + 1) % exampleCards.length);
    };

    element.addEventListener('mouseenter', hoverIn);
    element.addEventListener('mouseleave', hoverOut);

    gsap.fromTo(`#card${newCards[0].id}`,
        {
            x: '45%',
            y: '0%'
        },
        {
            x: '100%',
            y: '20%',
            duration: 2,
            ease: 'cubic.out'
        }
    )
    gsap.fromTo(`#card${newCards[1].id}`,
        {
            x: '55%',
            y: '0%'
        },
        {
            x: '-55%',
            y: '0%',
            duration: 2,
            ease: 'cubic.out'
        }
    )
    gsap.fromTo(`#card${newCards[2].id}`,
        {
            x: '-100%',
            y: '20%'
        },
        {
            x: '-45%',
            y: '0%',
            duration: 2,
            ease: 'cubic.out'
        }
    );

    return () => {
        element.removeEventListener('mouseenter', hoverIn);
        element.removeEventListener('mouseleave', hoverOut);
    }

  }, [currentIndex]);

  return (
    <div className="carousel-card-wrapper" ref={carouselRef}>
        {cards.map((card) => (
            <CarouselItem
                currentIndex={currentIndex}
                card={card}
                key={card.id}
            />
        ))}
    </div>
  );
}

// -----------------------------------------------------------------------------------------------------

function CarouselItem({ currentIndex, card }: CarouselItemProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      let element;
      if (currentIndex === card.id) {
          element = elementRef.current;
      }
      if (!element) return;

      const animateHoverIn = () => {
          gsap.to(element.querySelector('.card-content'), {
              scale: 1.4,
              y: '-20%',
              duration: 0.5,
          });
      }

      const animateHoverOut = () => {
          gsap.to(element.querySelector('.card-content'), {
              scale: 1,
              y: '0%',
              duration: 0.5,
          });
      }

      element.addEventListener('mouseenter', animateHoverIn);
      element.addEventListener('mouseleave', animateHoverOut);

      return () => {
          element.removeEventListener('mouseenter', animateHoverIn);
          element.removeEventListener('mouseleave', animateHoverOut);
      }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  const styles = {
      filter: currentIndex === card.id ? '' : 'blur(10px)',
      opacity: currentIndex === card.id ? 1 : 0.3,
      zIndex: currentIndex === card.id ? 1 : 0
  }

  return (
      <div id={`card${card.id}`} className="carousel-card" style={styles} ref={elementRef}>
          <span>{card.id + 1}</span>
          <video autoPlay loop muted className="card-content">
              <source src={card.graphic} />
          </video>
      </div>
  );
}