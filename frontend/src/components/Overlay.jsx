import React from 'react'
import styled from 'styled-components'

export default function Overlay() {

  const clickOverlay = () => {
    var humbergurIcon = document.querySelector('.c-sidebar')
    humbergurIcon.classList.remove('c-sidebar-show')

    var overlay = document.querySelector('.c-overlay')
    overlay.classList.remove('c-overlay-show')

    var dashboard = document.querySelector('.c-dashboard')
    dashboard.classList.remove('c-dashboard-show')
  }

  return (
    <Div>
      <div 
        className="c-overlay"
        onClick={() => clickOverlay()}
      ></div> 
    </Div>
  )
}

const Div = styled.div`
  /* overlay */
  .c-overlay{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    background-color: transparent !important;
    z-index: 1 !important;
  }
  .c-overlay.c-overlay-show{
    background-color: #d0fff461 !important;
    z-index: 2 !important;
  }
  /* akhir overlay */


  /* responsive */
  @media (min-width: 992px){
    .c-overlay{
      display: none;
    }
  }
  /* akhir responsive */
`