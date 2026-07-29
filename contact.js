// Contactformulier. Werkt op de Nederlandse en de Engelse supportpagina: de teksten
// komen uit data-attributen op het formulier, zodat er één script volstaat.
//
// Bewust géén `action` op het formulier: zonder JavaScript hoort er niets te gebeuren.
// Een tweede verzendweg naar een externe dienst zou betekenen dat berichten stilletjes
// ergens anders belanden zodra dit script faalt.

// ⚠️ Hier komt de URL van het eigen endpoint te staan, ná het uitrollen.
// Zie cowork/05-contactformulier.md.
const ENDPOINT = 'https://VUL-HIER-HET-ENDPOINT-IN/api/contact';

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  const submitBtn = form.querySelector('[type=submit]');
  const answerField = document.getElementById('captcha-answer');
  const questionField = document.getElementById('captcha-question');

  // Teksten per taal, meegegeven door de pagina.
  const t = form.dataset;

  let a = 0;
  let b = 0;

  function newSum() {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    questionField.textContent = t.msgCaptchaLabel.replace('{a}', a).replace('{b}', b);
    answerField.value = '';
  }

  newSum();

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    errorMsg.textContent = '';

    // 1. De rekensom.
    if (parseInt(answerField.value, 10) !== a + b) {
      errorMsg.textContent = t.msgCaptchaWrong;
      newSum();
      return;
    }

    // 2. Hooguit één bericht per minuut vanaf deze browser.
    const last = parseInt(localStorage.getItem('_contact_ts') || '0', 10);
    if (Date.now() - last < 60000) {
      const wait = Math.ceil((60000 - (Date.now() - last)) / 1000);
      errorMsg.textContent = t.msgWait.replace('{n}', wait);
      return;
    }

    // 3. Het onzichtbare veld. Ingevuld betekent: een bot. Stil stoppen.
    if (form.querySelector('[name=_gotcha]').value) return;

    const body = {
      name: form.querySelector('[name=name]').value.trim(),
      email: form.querySelector('[name=email]').value.trim(),
      subject: form.querySelector('[name=subject]').value.trim(),
      message: form.querySelector('[name=message]').value.trim(),
      source: 'klakkeloos-netwerk'
    };

    submitBtn.disabled = true;

    // Alleen een melding die de server zélf teruggeeft is bruikbaar voor de bezoeker.
    // Gaat de verbinding mis, dan komt er iets als "Load failed" uit de browser rollen —
    // dat zegt niemand iets, dus daar tonen we onze eigen zin voor.
    let serverMelding = '';

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      });
      const json = await res.json().catch(function () { return {}; });

      if (res.ok && json.success !== false) {
        localStorage.setItem('_contact_ts', String(Date.now()));
        form.reset();
        newSum();
        successMsg.textContent = t.msgSuccess;
      } else {
        serverMelding = json.error || '';
        throw new Error('verzenden mislukt');
      }
    } catch (err) {
      errorMsg.textContent = serverMelding || t.msgError;
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
