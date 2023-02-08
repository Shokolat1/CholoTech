var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer')

// METODOS GET ----------------------------------------------------------
// Pagina Principal
router.get('/', function (req, res, next) {
  res.render('index', { tab: 'CholoTech - Índice', title: 'CholoTech', sub: '¡Precios tan bajos, que parece que son robados!' });
});

// Formulario para escoger productos
router.get('/escoger', function (req, res, next) {
  res.render('form', { tab: 'CholoTech - Formulario de Búsqueda' })
})

// TODO:
// Pensando, mientras puppeteer encuentra la info

// TODO:
// Mostrar resultados

// METODOS POST --------------------------------------------------------
// 
router.post('/escoger', async function (req, res, next) {
  let datosPC = Object.values(req.body)

  let resAm = []
  let resML = []
  let resDD = []

  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];

  // Checar si vamos a obtener datos de RAM o SSD.
  // En DDTech se necesita ser especifico con ambas, siendo que las opciones elegidas son algo generales
  //   let ram = false
  //   if (i == 2) ram = true
  //   else ram = false

  //   let ssd = false
  //   if (i == 3) ssd = true
  //   else ssd = false

  //   let respAll = await search(dato, ram, ssd)
  //   resAm.push(respAll[0])
  //   resAm.push(respAll[1])
  //   resAm.push(respAll[2])
  // }

  // PRUEBA AMAZON
  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];
  //   let respAm = await testAmazon(dato)
  //   resAm.push(respAm)
  // }

  // console.log(resAm)

  // PRUEBA MERCADO LIBRE
  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];
  //   let respML = await testML(dato)
  //   resML.push(respML)
  // }

  // console.log(resML)

  // PRUEBA DDTECH
  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];

  // Checar si vamos a obtener datos de RAM o SSD.
  // En DDTech se necesita ser especifico con ambas, siendo que las opciones elegidas son algo generales
  //   let ram = false
  //   if (i == 2) ram = true
  //   else ram = false

  //   let ssd = false
  //   if (i == 3) ssd = true
  //   else ssd = false

  //   const respDD = await testDD(dato, ram, ssd)
  //   resDD.push(respDD)
  // }

  // console.log(resDD)

  // FIXME: Renderizar vista de cosas encontradas
  // res.render('wait', { tab: 'CholoTech - Buscando...' })
})

// FUNCIONES -------------------------------------------------------------------------------
// Funcion de prueba Amazon
async function testAmazon(dato) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.setDefaultTimeout(0);

  await page.goto('https://www.amazon.com.mx/');
  await page.setViewport({ width: 900, height: 768 });

  await page.type('#twotabsearchtextbox', dato);

  const buscarAmazon = '#nav-search-submit-button';
  await page.waitForSelector(buscarAmazon);
  await page.click(buscarAmazon);

  // Buscar resultado de 4 estrellas o mas
  const cuatroOmas = 'section > .a-star-medium-4'
  await page.waitForSelector(cuatroOmas);
  await page.click(cuatroOmas);

  // Se va al primer producto encontrado
  const linkprodAmazon = 'span[data-component-type="s-product-image"] > a'
  await page.waitForSelector(linkprodAmazon);
  await page.click(linkprodAmazon);

  // Informacion a encontrar -----------------------------
  // Nombre de producto
  const nomAm = dato

  // Link de producto
  const linkAm = page.url()

  // Descripcion del producto
  const descrip = '#title > #productTitle'
  await page.waitForSelector(descrip);
  const descripAm = await page.evaluate(descrip => {
    const d = document.querySelector(descrip);
    return d.innerHTML.trim()
  }, descrip)

  // Precio del producto
  const price = '.a-price > span[aria-hidden="true"] > span.a-price-whole'
  await page.waitForSelector(price);
  const precioAm = await page.evaluate(price => {
    let elem = document.querySelector(price).innerHTML
    let i = elem.indexOf("<")
    let newS = elem.slice(0, i)
    let num = `$${newS}`
    return num
  }, price)

  // Precio de envio del producto
  const send = '#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE > span'

  const costEnvAm = await page.evaluate(send => {
    let newS = ''

    let s = document.querySelector(send).innerHTML
    let i = s.indexOf("$")
    if (i != -1) {
      let dot = s.indexOf(".")
      newS = s.slice(i, dot + 3)
    } else {
      newS = "Envío Gratis"
    }
    return newS
  }, send)

  let cosasAm = [nomAm, linkAm, descripAm, precioAm, costEnvAm]

  browser.close();

  return cosasAm
}

// Funcion de prueba Mercado
async function testML(dato) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.setDefaultTimeout(0);

  await page.goto('https://www.mercadolibre.com.mx/');
  await page.setViewport({ width: 900, height: 768 });

  // const busML = '.nav-search-input';
  // await page.waitForSelector(busML);
  await page.type('#cb1-edit', dato);

  const buscarML = '.nav-search-btn';
  await page.waitForSelector(buscarML);
  await page.click(buscarML);

  const linkProdML = 'a > .ui-search-item__title'
  await page.waitForSelector(linkProdML);
  await page.click(linkProdML);

  // Informacion a encontrar -----------------------------
  // Nombre de producto
  const nomML = dato

  // Link de producto
  const linkML = page.url()

  // Descripcion del producto
  const descrip = '.ui-pdp-header > .ui-pdp-header__title-container > h1'
  await page.waitForSelector(descrip);
  const descripML = await page.evaluate(descrip => {
    const d = document.querySelector(descrip);
    return d.innerHTML
  }, descrip)

  // Precio del producto
  const price = 'div > span.andes-money-amount > span.andes-money-amount__fraction'
  await page.waitForSelector(price);
  const precioML = await page.evaluate(price => {
    let elem = document.querySelector(price).innerHTML
    let newS = `$${elem}`
    return newS
  }, price)

  // Precio de envio del producto
  const send = '.andes-tooltip__trigger > .ui-pdp-color--GREEN'
  let newS = ''

  if (await page.evaluate(send => { }) != null) {
    await page.evaluate(send => {
      let s = document.querySelector(send).innerHTML
      let i = s.indexOf("<")
      newS = s.slice(0, i).trim()
    }, send)
  } else {
    newS = 'Envío gratis a todo el país'
  }
  const costEnvML = newS

  let cosasML = [nomML, linkML, descripML, precioML, costEnvML]

  browser.close();

  return cosasML
}

// Funcion de prueba DDTech
async function testDD(dato, ram, ssd) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://ddtech.mx/', { 'waitUntil': 'load' });
  await page.setViewport({ width: 1366, height: 720 });
  page.waitForNavigation()
  await waitTillHTMLRendered(page)

  const busca = '.search-container > form > .input-group > #search';
  await page.waitForSelector(busca, {
    visible: true,
  });
  await page.click(busca);
  await page.type(busca, dato);

  const buscarDD = 'span.input-group-btn > .btn-seach';
  await page.waitForSelector(buscarDD, {
    visible: true,
  });
  await page.click(buscarDD);

  if (ram) {
    const searchRAM = '.breadcrumb-custom > li > a[title="Memoria RAM"]'
    await page.waitForSelector(searchRAM, {
      visible: true,
    });
    await page.click(searchRAM);
  }

  if (ssd) {
    const onlySSD = '.breadcrumb-custom > li > a[title="Unidades SSD"]'
    await page.waitForSelector(onlySSD, {
      visible: true,
    });
    await page.click(onlySSD);

    const searchSSD = '#stock'
    await page.waitForSelector(searchSSD, {
      visible: true,
    });
    await page.click(searchSSD);
  }

  const linkProdDD = '.product-info > .name > a'
  await page.waitForSelector(linkProdDD, {
    visible: true,
  });
  await page.click(linkProdDD);

  await waitTillHTMLRendered(page)

  // Informacion a encontrar -----------------------------
  // Nombre de producto
  const nomDD = dato

  // Link de producto
  const linkDD = page.url()

  // Descripcion del producto
  const descrip = '.product-info-block > .product-info > .description-container > p'
  await page.waitForSelector(descrip, {
    visible: true,
  });
  const descripDD = await page.evaluate(descrip => {
    const d = document.querySelector(descrip);
    return d.innerHTML.trim()
  }, descrip)

  // Precio del producto
  const price = '.price-box > span.price'
  await page.waitForSelector(price, {
    visible: true,
  });
  const precioDD = await page.evaluate(price => {
    let elem = document.querySelector(price).innerHTML
    let newS = elem.trim().slice(0, -3)
    return newS
  }, price)

  // Ir a ver el precio del envío
  const carDD = '.quantity-container > .row > .col-sm-7 > .add-cart'
  await page.waitForSelector(carDD, {
    visible: true,
  });
  await page.click(carDD);

  const verCar = 'ul.nav > li > a[title="Carrito"]'
  await page.waitForSelector(verCar, {
    visible: true,
  });
  await page.click(verCar);

  await waitTillHTMLRendered(page)

  // Precio de envio del producto
  const send = '.cart-sub-total > .form-group > #shipping-price'
  await page.waitForSelector(send, {
    visible: true,
  });
  const costEnvDD = await page.evaluate(send => {
    let s = document.querySelector(send).innerHTML
    let newS = s.slice(0, -3)
    return newS
  }, send)

  const elimCar = '#delete-entire-cart'
  await page.waitForSelector(elimCar, {
    visible: true,
  });
  await page.click(elimCar);

  let cosasDD = [nomDD, linkDD, descripDD, precioDD, costEnvDD]

  browser.close();

  return cosasDD
}

// FIXME: Hacer correcciones con métodos de prueba arreglados; agregar resultados en un orden especifico en un mismo arreglo
// Función búsqueda completa
async function search(data, ram, ssd) {
  const browser = await puppeteer.launch({ headless: false });
  const amazonPg = await browser.newPage();
  const mlPg = await browser.newPage();
  const cpPg = await browser.newPage();

  await amazonPg.setDefaultTimeout(0);
  await mlPg.setDefaultTimeout(0);
  await cpPg.setDefaultTimeout(0);

  await amazonPg.goto('https://www.amazon.com.mx/');
  await mlPg.goto('https://www.mercadolibre.com.mx/');
  await cpPg.goto('https://www.cyberpuerta.mx/');

  // Establece tamaño de ventana
  await amazonPg.setViewport({ width: 900, height: 768 });
  await mlPg.setViewport({ width: 900, height: 768 });
  await cpPg.setViewport({ width: 900, height: 768 });

  // Preparar arreglos para luego evaluar cada componente entre páginas
  let cosasAmazon = []
  let cosasMerLib = []
  let cosasCP = []

  // FIXME:
  // Foreach para cada elemento en 'data', que viene del formulario de cosas
  data.forEach(async (el) => {
    // Teclea en barra de buscador
    await amazonPg.type('#twotabsearchtextbox', el);
    await mlPg.type('#cb1-edit', el);
    await cpPg.type('.search-form > input[type="text"]', el);

    // Busca boton de 'busqueda' y lo clickea
    await setTimeout(async () => {
      const buscarAmazon = '#nav-search-submit-button';
      await amazonPg.waitForSelector(buscarAmazon);
      await amazonPg.click(buscarAmazon);

      const buscarML = '.nav-search-btn';
      await mlPg.waitForSelector(buscarML);
      await mlPg.click(buscarML);

      const buscarDoor = '.submitButton';
      await cpPg.waitForSelector(buscarDoor);
      await cpPg.click(buscarDoor);
    }, 5000);

    // Buscar resultado de 4 estrellas o mas en Amazon
    const cuatroOmas = 'section > .a-star-medium-4'
    await amazonPg.waitForSelector(cuatroOmas);
    await amazonPg.click(cuatroOmas);

    // Se va al primer producto encontrado
    const linkprodAmazon = 'span[data-component-type="s-product-image"] > a'
    await amazonPg.waitForSelector(linkprodAmazon);
    await amazonPg.click(linkprodAmazon);

    const linkProdML = 'a > .ui-search-item__title'
    await mlPg.waitForSelector(linkProdML);
    await mlPg.click(linkProdML);

    const linkProdDoor = '#searchList-1'
    await cpPg.waitForSelector(linkProdDoor);
    await cpPg.click(linkProdDoor);

    // Informacion a encontrar -----------------------------
    // Nombre de producto
    const nomAm = el
    const nomML = el
    const nomCP = el

    // Link de producto
    const linkAm = amazonPg.url()
    const linkML = mlPg.url()
    const linkCP = cpPg.url()

    // Descripcion del producto
    const descrip1 = '#title > #productTitle'
    await amazonPg.waitForSelector(descrip1);
    const descripAm = await amazonPg.evaluate(descrip1 => {
      const d = document.querySelector(descrip1);
      return d.innerHTML.trim()
    }, descrip1)

    const descrip2 = '.ui-pdp-header > .ui-pdp-header__title-container > h1'
    await mlPg.waitForSelector(descrip2);
    const descripML = await mlPg.evaluate(descrip2 => {
      const d = document.querySelector(descrip2);
      return d.innerHTML
    }, descrip2)

    const descrip3 = '.detailsInfo_right > h1.detailsInfo_right_title'
    await cpPg.waitForSelector(descrip3);
    const descripCP = await cpPg.evaluate(descrip3 => {
      const d = document.querySelector(descrip3);
      return d.innerHTML.trim()
    }, descrip3)

    // Precio del producto
    const price1 = '.a-price > span[aria-hidden="true"] > span.a-price-whole'
    await amazonPg.waitForSelector(price1);
    const precioAm = await amazonPg.evaluate(price1 => {
      let elem = document.querySelector(price1).innerHTML
      let i = elem.indexOf("<")
      let newS = elem.slice(0, i)
      let num = `$${newS}`
      return num
    }, price1)

    const price2 = 'div > .andes-money-amount > .andes-money-amount__fraction'
    await mlPg.waitForSelector(price2);
    const precioML = await mlPg.evaluate(price2 => {
      let elem = document.querySelector(price2).innerHTML
      let newS = `$${elem}`
      return newS
    }, price2)

    const price3 = '.detailsInfo_pricebox_main > .mainPrice > span.priceText'
    await cpPg.waitForSelector(price3);
    const precioCP = await cpPg.evaluate(price3 => {
      let elem = document.querySelector(price3).innerHTML
      let newS = elem.slice(0, -3)
      return newS
    }, price3)

    // Precio de envio del producto
    const send1 = '#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE > span > a'
    const costEnvAm = await amazonPg.evaluate(send1 => {
      let s = document.querySelector(send1).innerHTML
      return s
    }, send1)

    const send2 = '.andes-tooltip__trigger > .ui-pdp-color--GREEN'
    const costEnvML = await mlPg.evaluate(send2 => {
      let s = document.querySelector(send2).innerHTML
      let i = s.indexOf("<")
      let newS = s.slice(0, i).trim()
      return newS
    }, send2)

    const send3 = '.deliverycost > span.deliveryvalue'
    const costEnvCP = await cpPg.evaluate(send3 => {
      let s = document.querySelector(send3).innerHTML
      let newS = s.slice(0, -3)
      return newS
    }, send3)

    cosasAmazon.push([nomAm, linkAm, descripAm, precioAm, costEnvAm])
    cosasMerLib.push([nomML, linkML, descripML, precioML, costEnvML])
    cosasCP.push([nomCP, linkCP, descripCP, precioCP, costEnvCP])
  })

  // Esperamos 5 segundos hasta que el navegador se cierre para que todo se cargue bien
  await setTimeout(() => {
    browser.close();
    console.log(cosasAmazon)
    console.log(cosasMerLib)
    console.log(cosasCP)
  }, 5000);
}

// Función para esperar a que las paginas (en nuestro caso DDTech) carguen todos sus scripts y elementos
const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts++ <= maxChecks) {
    let html = await page.content();
    let currentHTMLSize = html.length;

    // let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
    // console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
      countStableSizeIterations++;
    else
      //Reiniciar contador
      countStableSizeIterations = 0;

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }
};

module.exports = router;
