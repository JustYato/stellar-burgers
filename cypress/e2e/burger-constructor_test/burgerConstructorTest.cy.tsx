const selectors = {
  ingredientButton: (id) => `[data-cy=ingredient-${id}]`,
  constructorItem: (id) => `[data-cy=constructor-${id}]`,
  closeButton: 'button[aria-label="Закрыть"]',
  submitOrderButton: '[id=submit-order-button]',
  orderNumber: '[data-cy=order-number]',
  containerConstructor: '[data-cy=container-constructor]',
};
const ingredientNames = {
  ingredient1: 'Флюоресцентная булка R2-D3',
  ingredient2: 'Мясо бессмертных моллюсков Protostomia',
  ingredient3: 'Соус с шипами Антарианского плоскоходца',
};

describe('Конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('Добавление ингредиента из списка в конструктор', () => {
    const ingredients = [1, 2, 3];
    const names = [
      ingredientNames.ingredient1,
      ingredientNames.ingredient2,
      ingredientNames.ingredient3,
    ];

    ingredients.forEach((id, index) => {
      cy.get(selectors.ingredientButton(id))
        .as(`ingredient${id}`)
        .contains('Добавить')
        .click();

      cy.get(selectors.constructorItem(id))
        .contains(names[index])
        .should('exist');
    });
  });
});

describe('Модальные окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  const openModal = () => {
    cy.get(selectors.ingredientButton(1)).as('ingredient1').click();
  };

  const closeModal = () => {
    cy.get(selectors.closeButton).click();
  };

  it('Открытие модального окна', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    openModal();
    cy.get('@ingredient1').contains(ingredientNames.ingredient1).should('exist');
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
    cy.visit('/');
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
      cy.get(selectors.ingredientButton(id))
        .as(`ingredient${id}`)
        .contains('Добавить')
        .click();
    });

    cy.get(selectors.submitOrderButton).contains('Оформить заказ').click();
    cy.wait('@postOrder');
    cy.get(selectors.orderNumber).contains('61532').should('exist');
    cy.get(selectors.closeButton).click();
    cy.get(selectors.orderNumber).should('not.exist');

    const removedIngredients = Object.values(ingredientNames);
    removedIngredients.forEach((name) => {
      cy.get(selectors.containerConstructor).contains(name).should('not.exist');
    });
  });
});
