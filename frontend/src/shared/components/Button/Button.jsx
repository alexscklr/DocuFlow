import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ButtonToLink({ icon, label, slug }) {

    const navigate = useNavigate();

    return <button onClick={() => navigate(`${slug}`)}><img src={icon} alt={label} /> {label}</button>;
}