'use strict';

const { sanitizeEntity } = require('strapi-utils/lib');

const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    // simplify cart data
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    // get all games
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

      if (!games.length) {
        ctx.response.status = 404;
        return {
          error: "No valid games found!",
        };
      }

      const total = await strapi.config.functions.cart.total(games);

      if (total === 0) {
        return {
          freeGames: true,
        };
      }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: (total * 100).toFixed(),
        currency: 'usd',
        metadata: { cart: JSON.stringify(cartGamesIds) },
      });

      return paymentIntent;
    } catch (err) {
      return {
        error: err.raw.message,
      };
    }
  },

  create: async (ctx) => {
    // pegar as informações do frontend
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    // pegar o token
    const token = await strapi.plugins["users-permissions"].services.jwt.getToken(ctx);

    // pega o id do usuário
    const userId = token.id

    // pega as informações do usuário
    const userInfo = await strapi
      .query("user", "users-permissions")
      .findOne({ id: userId })

    // simplify cart data
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    // pegar os jogos
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    // pegar total (saber se é free ou não)
    const total_in_cents = await strapi.config.functions.cart.total(games);

    // precisa pegar do frontend os valores do paymentMethod
    // e recuperar por aqui

    // salvar no banco
    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      card_brand: null,
      card_last4: null,
      user: userInfo,
      games,
    };

    const entity = await strapi.services.order.create(entry);

    // enviar um email da compra para o usuário

    // retornando que foi salvo no banco
    return sanitizeEntity(entity, { model: strapi.models.order });

  }
};
