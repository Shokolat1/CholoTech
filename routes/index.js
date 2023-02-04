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
  let resCP = []

  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];
  //   let respAll = await search(dato)
  //   resAm.push(respAll[0])
  //   resAm.push(respAll[1])
  //   resAm.push(respAll[2])
  // }

  // PRUEBA AMAZON
  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];
  //   let respAm = await testAmazon(dato)
  //   resAm.push(respAm)
  //   console.log(respAm)
  // }

  // PRUEBA MERCADO LIBRE
  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];
  //   let respML = await testML(dato)
  //   resML.push(respML)
  //   console.log(respML)
  // }

  // PRUEBA CYBERPUERTA
  // for (let i = 0; i < datosPC.length; i++) {
  //   const dato = datosPC[i];
  //   let respCP = await testCP(dato)
  //   resML.push(respCP)
  //   console.log(respCP)
  // }

  // await testML(datosPC[0])
  // await testDoor(datosPC[0])
  // res.render('wait', { tab: 'CholoTech - Buscando...' })
})

// FUNCIONES -----------------------------------------------------------
// Funcion de prueba Amazon
async function testAmazon(dato) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setDefaultTimeout(0);

  await page.goto('https://www.amazon.com.mx/');
  await page.setViewport({ width: 900, height: 768 });


  // setTimeout(async () => {
  await page.type('#twotabsearchtextbox', dato);
  // }, 5000);

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
  const send = '#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE > span > a'
  const costEnvAm = await page.evaluate(send => {
    let s = document.querySelector(send).innerHTML
    return s
  }, send)

  let cosasAm = [nomAm, linkAm, descripAm, precioAm, costEnvAm]

  setTimeout(() => {
    browser.close();
  }, 3000);

  return cosasAm
}

// FIXME: Hacer correcciones como Amazon
// Funcion de prueba Mercado
async function testML(dato) {
  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

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
    const price = 'div > .andes-money-amount > .andes-money-amount__fraction'
    await page.waitForSelector(price);
    const precioML = await page.evaluate(price => {
      let elem = document.querySelector(price).innerHTML
      let newS = `$${elem}`
      return newS
    }, price)

    // Precio de envio del producto
    const send = '.andes-tooltip__trigger > .ui-pdp-color--GREEN'
    const costEnvML = await page.evaluate(send => {
      let s = document.querySelector(send).innerHTML
      let i = s.indexOf("<")
      let newS = s.slice(0, i).trim()
      return newS
    }, send)

    let cosasCP = [nomML, linkML, descripML, precioML, costEnvML]
    console.log(cosasCP)
  })()
}

// FIXME: Hacer correcciones como Amazon
// Funcion de prueba CyberPuerta
async function testDoor(dato) {
  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.cyberpuerta.mx/');
    await page.setViewport({ width: 900, height: 768 });

    await page.type('.search-form > input[type="text"]', dato);

    await setTimeout(async () => {
      const buscarDoor = '.submitButton';
      await page.waitForSelector(buscarDoor);
      await page.click(buscarDoor);
    }, 5000);

    const linkProdDoor = '#searchList-1'
    await page.waitForSelector(linkProdDoor);
    await page.click(linkProdDoor);

    // Informacion a encontrar -----------------------------
    // Nombre de producto
    const nomCP = dato

    // Link de producto
    const linkCP = page.url()

    // Descripcion del producto
    const descrip = '.detailsInfo_right > h1.detailsInfo_right_title'
    await page.waitForSelector(descrip);
    const descripCP = await page.evaluate(descrip => {
      const d = document.querySelector(descrip);
      return d.innerHTML.trim()
    }, descrip)

    // Precio del producto
    const price = '.detailsInfo_pricebox_main > .mainPrice > span.priceText'
    await page.waitForSelector(price);
    const precioCP = await page.evaluate(price => {
      let elem = document.querySelector(price).innerHTML
      let newS = elem.slice(0, -3)
      return newS
    }, price)

    // Precio de envio del producto
    const send = '.deliverycost > span.deliveryvalue'
    const costEnvCP = await page.evaluate(send => {
      let s = document.querySelector(send).innerHTML
      let newS = s.slice(0, -3)
      return newS
    }, send)

    let cosasCP = [nomCP, linkCP, descripCP, precioCP, costEnvCP]
    console.log(cosasCP)
  })()
}

// FIXME: Hacer correcciones como Amazon; agregar resultados en un orden especifico en un mismo arreglo
// Función búsqueda completa
async function search(data) {
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

module.exports = router;
