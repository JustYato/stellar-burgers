describe('Конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('Добавление ингредиента из списка в конструктор', () => {
    const ingredients = [1, 2, 3];
    const names = [
      'Флюоресцентная булка R2-D3',
      'Мясо бессмертных моллюсков Protostomia',
      'Соус с шипами Антарианского плоскоходца'
    ];

    ingredients.forEach((id, index) => {
      cy.get(`[data-cy=ingredient-${id}]`).contains('Добавить').click();
      cy.get(`[data-cy=constructor-${id}]`)
        .contains(names[index])
        .should('exist');
    });
  });
});

describe('Модальные окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  const openModal = () => {
    cy.get('[data-cy=ingredient-1]').click();
  };

  const closeModal = () => {
    cy.get('button[aria-label="Закрыть"]').click();
  };

  it('Открытие модального окна', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    openModal();
    cy.contains('Флюоресцентная булка R2-D3').should('exist');
  });

  it('Закрытие модального окна', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    openModal();
    closeModal();
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Заказы', () => {
  const setupOrderEnvironment = () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('data.refreshToken')
    );
    cy.setCookie('accessToken', 'data.accessToken');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  };

  beforeEach(() => {
    setupOrderEnvironment();
  });

  afterEach(() => {
    cy.clearAllLocalStorage();
    cy.clearCookies();
  });

  it('Создание заказа', () => {
    const ingredients = [1, 2, 3];
    ingredients.forEach((id) => {
      cy.get(`[data-cy=ingredient-${id}]`).contains('Добавить').click();
    });

    cy.get('[id=submit-order-button]').contains('Оформить заказ').click();
    cy.wait('@postOrder');
    cy.get('[data-cy=order-number]').contains('61532').should('exist');
    cy.get('button[aria-label="Закрыть"]').click();
    cy.get('[data-cy=order-number]').should('not.exist');

    const removedIngredients = [
      'Флюоресцентная булка R2-D3',
      'Мясо бессмертных моллюсков Protostomia',
      'Соус с шипами Антарианского плоскоходца'
    ];
    removedIngredients.forEach((name) => {
      cy.get('[data-cy=container-constructor]')
        .contains(name)
        .should('not.exist');
    });
  });
});
