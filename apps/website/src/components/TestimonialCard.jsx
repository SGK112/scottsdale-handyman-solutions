import React from 'react';
import StarRating from './StarRating';

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card">
    <div className="testimonial-avatar">
      <img src={testimonial.avatar} alt={testimonial.name} />
    </div>
    <p className="testimonial-quote">"{testimonial.quote}"</p>
    <div className="testimonial-author">{testimonial.name}</div>
    <div className="testimonial-location">{testimonial.location}</div>
    <StarRating rating={testimonial.rating} />
  </div>
);

export default TestimonialCard;
