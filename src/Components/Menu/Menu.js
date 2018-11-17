import React from 'react';

const menu = () => {
  return (
<section id="menu" class="section section__menu">
      <div class="row">

        <div class="col-md-6 col-sm-12">
          <h2 class="menu-section__title">Appetisers</h2>
          <ul class="menu-section__list">
            <li class="menu-section__item">
              <h3>Tzatsiki</h3> <span>$3.99</span>
              <p class="menu-section-description">Refreshing traditional cucumber and garlic youghurt dip.</p>
            </li>
            <li class="menu-section__item">
              <h3>Aubergine salad</h3> <span>$5.00</span>
              <p class="menu-section-description">Purred eggplant, garlic, green pepper and tomato dip</p>
            </li>
            <li class="menu-section__item">
              <h3>Cesar salad</h3> <span>$6.00</span>
              <p class="menu-section-description">Grilled chicken, garlic, red pepper, youghurt dip</p>
            </li>
          </ul>
        </div>

        <div class="col-md-6 col-sm-12">
          <h2 class="menu-section__title">Starters</h2>
          <ul class="menu-section__list">
            <li class="menu-section__item">
              <h3>Haloumi</h3> <span>$3.99</span>
              <p class="menu-section-description">Refreshing traditional cucumber and garlic youghurt dip.</p>
            </li>
            <li class="menu-section__item">
              <h3>Spinach Pie</h3> <span>$5.00</span>
              <p class="menu-section-description">Purred eggplant, garlic, green pepper and tomato dip</p>
            </li>
          </ul>
        </div>

      </div>
      <div class="row">

          <div class="col-md-6 col-sm-12">
            <h2 class="menu-section__title">Salads</h2>
            <ul class="menu-section__list">
              <li class="menu-section__item">
                <h3>Olive special</h3> <span>$3.99</span>
                <p class="menu-section-description">Refreshing traditional cucumber and garlic youghurt dip.</p>
              </li>
              <li class="menu-section__item">
                <h3>Greek salad</h3> <span>$5.00</span>
                <p class="menu-section-description">Purred eggplant, garlic, green pepper and tomato dip</p>
              </li>
              <li class="menu-section__item">
                <h3>Gusto salad</h3> <span>$5.00</span>
                <p class="menu-section-description">Purred eggplant, garlic, green pepper and tomato dip</p>
              </li>
            </ul>
          </div>
  
          <div class="col-md-6 col-sm-12">
            <article class="menu-section__container">
              <h2 class="menu-section__title">Main Dishes</h2>
              <ul class="menu-section__list">
                <li class="menu-section__item">
                  <h3>Cornish mackerel</h3> <span>$8.99</span>
                  <p class="menu-section-description">Refreshing traditional cucumber and garlic youghurt dip.</p>
                </li>
                <li class="menu-section__item">
                  <h3>Roast Lamb</h3> <span>$5.99</span>
                  <p class="menu-section-description">Refreshing traditional cucumber and garlic youghurt dip.</p>
                </li>
                <li class="menu-section__item">
                  <h3>Fried Chicken</h3> <span>$5.20</span>
                  <p class="menu-section-description">Purred eggplant, garlic, green pepper and tomato dip</p>
                </li>
                <li class="menu-section__item">
                  <h3>Pastitsio</h3> <span>$5.70</span>
                  <p class="menu-section-description">Purred eggplant, garlic, green pepper and tomato dip</p>
                </li>
              </ul>
            </article>
          </div>
  
        </div>
    </section>
  );
}

export default menu;