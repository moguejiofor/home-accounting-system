const ipcRenderer = require('electron').ipcRenderer;
const incomeView = require('../data/IncomeView.js').IncomeView;
const orderView = require('../data/OrderView').OrderView;
const Income = require('../data/entities.js').Income;
const Order = require('../data/entities.js').Order;
const OrderStatus = require('../data/entities.js').OrderStatus;
const shell = require('electron').shell;

google.charts.load("current", {packages: ['corechart']});

orderView.setupView();
orderView.setCallbacks(onDeleteOrder, onLinkClick);
incomeView.setCallbacks(onDeleteIncome);



ipcRenderer.on('error', function (event, data) {
    alert(data);
});

ipcRenderer.on('income-data', function (event, data) {
    incomeView.setData(data);
});

ipcRenderer.on('income-payment-types' ,function (event, data) {
    incomeView.setPaymentTypes(data);
});

ipcRenderer.on('income-contacts' ,function (event, data) {
    incomeView.setContacts(data);
});

ipcRenderer.on('income-data-inserted', function (event, data) {
    incomeView.insertIncome(data);
    orderView.updatePaymentData('add', data);
});

ipcRenderer.on('orders-data', function (event, data) {
    orderView.setData(data);
    incomeView.setOrders(data);
});

ipcRenderer.on('orders-payment-data', function (event, data) {
    orderView.setPaymentData(data);
});

ipcRenderer.on('order-types' ,function (event, data) {
    orderView.setTypes(data);
});

ipcRenderer.on('order-contacts' ,function (event, data) {
    orderView.setContacts(data);
});

ipcRenderer.on('order-data-inserted', function (event, data) {
    orderView.insertOrder(data);
    incomeView.updateOrderData('add', data);
});

$(document).ready(function () {
    $('a').click(onLinkClick);

    $('.js-tab').click(function () {
        let name = $(this).data('name');
        $('.js-page').removeClass('active');
        $('.js-tab').removeClass('active');
        $(this).addClass('active');
        $('.js-page[data-name="' + name + '"]').addClass('active');
    });

    $(".js-income-page .js-income-add").on('submit', function (e) {
        e.preventDefault();
        let date = $('.js-income-page input.js-add-date').val();
        let month = $('.js-income-page input.js-add-month').val();
        let sum = $('.js-income-page input.js-add-sum').val();
        let type = $('.js-income-page input.js-add-payment-type').val();
        let contact = $('.js-income-page input.js-add-contact').val();
        let description = $('.js-income-page input.js-add-description').val();
        if (date.length == 0 || month.length == 0 || sum.length == 0 || type.length == 0 || contact.length == 0) {
            alert("Error");
            return;
        }
        let orderId = $('.js-income-page input.js-add-order').data('order-id');
        let orderPaymentType = null;
        if (orderId != undefined) {
            orderPaymentType = $('.js-income-page select.js-add-order-payment').val();
        } else {
            orderId = null;
        }

        let data = new Income(moment(date), moment(month), parseInt(sum), type, contact, description, orderId, orderPaymentType);

        ipcRenderer.send('income-add', data);
    });

    $(".js-orders-page .js-orders-add").on('submit', function (e) {
        e.preventDefault();
        let month = $('.js-orders-page input.js-add-month').val();
        let sum = $('.js-orders-page input.js-add-sum').val();
        let contact = $('.js-orders-page input.js-add-contact').val();
        let type = $('.js-orders-page input.js-add-type').val();
        let description = $('.js-orders-page input.js-add-description').val();
        let link = $('.js-orders-page input.js-add-link').val();
        let status = $('.js-orders-page select.js-add-status').val();
        if (month.length == 0 || sum.length == 0 || type.length == 0 || contact.length == 0 || description.length == 0 || status.length == 0 || OrderStatus[status] == undefined) {
            alert("Error");
            return;
        }

        let data = new Order(
            moment(month),
            parseInt(sum),
            0,
            0,
            0,
            contact,
            type,
            description,
            link,
            status);

        ipcRenderer.send('order-add', data);
    });
});

function onLinkClick(e) {
    if ($(this).attr('href') != undefined) {
        e.preventDefault();
        shell.openExternal($(this).attr('href'));
    }
}

function onDeleteOrder(order) {
    ipcRenderer.send('order-delete', order.id);
    incomeView.updateOrderData('delete', order);
}

function onDeleteIncome(income) {
    ipcRenderer.send('income-delete', income.id);
    orderView.updatePaymentData('delete', income);
}