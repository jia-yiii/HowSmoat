import React from 'react';
import { NavLink } from 'react-router-dom';
import SideStyles from './Sidebar.module.css';

const PETS = ['dog','cat','mouse','bird'];

export default function Sidebar({ topic, selected }) {
  return (
    <aside className={SideStyles.sidebar}>
      <ul>
        {PETS.map(p => (
          <li key={p}>
            <NavLink
              to={`/${topic}/${p}`}
              className={selected === p ? SideStyles.active : ''}
            >
              {({
                dog: '狗狗篇',
                cat: '貓咪篇',
                mouse: '倉鼠篇',
                bird: '鳥類篇'
              })[p]}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
