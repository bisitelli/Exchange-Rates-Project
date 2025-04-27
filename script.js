// Valuutoille liitetään liput, jotka saadaan flagcdn.com sivustolta
const flags = {
    AUD: "https://flagcdn.com/48x36/au.png",
    USD: "https://flagcdn.com/48x36/us.png",
    BGN: "https://flagcdn.com/48x36/bg.png",
    BRL: "https://flagcdn.com/48x36/br.png",
    CAD: "https://flagcdn.com/48x36/ca.png",
    CHF: "https://flagcdn.com/48x36/ch.png",
    CNY: "https://flagcdn.com/48x36/cn.png",
    CZK: "https://flagcdn.com/48x36/cz.png",
    DKK: "https://flagcdn.com/48x36/dk.png",
    EUR: "https://flagcdn.com/48x36/eu.png",
    GBP: "https://flagcdn.com/48x36/gb.png",
    HKD: "https://flagcdn.com/48x36/hk.png",
    HUF: "https://flagcdn.com/48x36/hu.png",
    IDR: "https://flagcdn.com/48x36/id.png",
    ILS: "https://flagcdn.com/48x36/il.png",
    INR: "https://flagcdn.com/48x36/in.png",
    ISK: "https://flagcdn.com/48x36/is.png",
    JPY: "https://flagcdn.com/48x36/jp.png",
    KRW: "https://flagcdn.com/48x36/kr.png",
    MXN: "https://flagcdn.com/48x36/mx.png",
    MYR: "https://flagcdn.com/48x36/my.png",
    NOK: "https://flagcdn.com/48x36/no.png",
    NZD: "https://flagcdn.com/48x36/nz.png",
    PHP: "https://flagcdn.com/48x36/ph.png",
    PLN: "https://flagcdn.com/48x36/pl.png",
    RON: "https://flagcdn.com/48x36/ro.png",
    SEK: "https://flagcdn.com/48x36/se.png",
    SGD: "https://flagcdn.com/48x36/sg.png",
    THB: "https://flagcdn.com/48x36/th.png",
    TRY: "https://flagcdn.com/48x36/tr.png",
    ZAR: "https://flagcdn.com/48x36/za.png"
};

// Lataa valuuttalistan kun sivusto aukeaa ja vertaa niitä usd valuuttaan
async function fetchRates(fromCurrency = "USD", toCurrency = "") {
    const resultsDiv = document.getElementById("result");
    resultsDiv.innerHTML = "Loading...";

    // Haetaan käyttäjän syöttämä määrä input-kentästä (amount-input)
    // parseFloat muuttaa syötetyn arvon liukuluvuksi (float), tai jos syöte on virheellinen, käytetään oletusarvoa 1
    const amount = parseFloat(document.getElementById("amount-input").value) || 1;

    // Käytetään Frankfurter APIa valuuttakurssien hakemiseen
    let url = `https://api.frankfurter.app/latest?from=${fromCurrency}`;
    if (toCurrency) {
        url += `&to=${toCurrency}`;
    }

    // Haetaan valuuttakurssit ja näytetään ne
    try {
        const res = await fetch(url);
        const data = await res.json();

        let html = "";

        // Näytetään käyttäjän syöttämä valuutta ja sen määrä
        if (toCurrency) {
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(4);
            html += `<div class="rate-box">
                    <img src="${flags[toCurrency]}" alt="${toCurrency} flag">
                    <span>${toCurrency}:</span> ${convertedAmount}
                </div>`;

            // Näytetään kaikki valuuttakurssit
        } else {
            for (const [currency, rate] of Object.entries(data.rates)) {
                const convertedAmount = (amount * rate).toFixed(4);

                // Luodaan HTML boxi jokaiselle valuutalle
                // ja näytetään valuutan lippu, valuutta ja sen määrä
                html += `<div class="rate-box">
                    <img src="${flags[currency]}" alt="${currency} flag">
                    <span>${currency}:</span> ${convertedAmount}
                </div>`;
            }
        }

        // Asetetaan lopullinen HTML tulos näkyville
        resultsDiv.innerHTML = html;

        // Jos API-kutsu epäonnistuu, näytetään virhe
    } catch (error) {
        resultsDiv.innerHTML = "Error fetching data";
        console.error(error);
    }
}

// Kun sivu aukeaa se näyttää USD → kaikki
fetchRates();

// Päivitetään kurssit heti kun käyttäjä valitsee uudet valuutat
document.getElementById("from-currency").addEventListener("change", () => {
    const from = document.getElementById("from-currency").value;
    const to = document.getElementById("to-currency").value;
    fetchRates(from, to);
});

document.getElementById("to-currency").addEventListener("change", () => {
    const from = document.getElementById("from-currency").value;
    const to = document.getElementById("to-currency").value;
    fetchRates(from, to);
});

document.getElementById("amount-input").addEventListener("input", () => {
    const from = document.getElementById("from-currency").value;
    const to = document.getElementById("to-currency").value;
    fetchRates(from, to);
});