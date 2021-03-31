// 1. Go to https://www.linkedin.com/company/{COMPANY_NAME}/people/
// 2. Make sure your LinkedIn is in English
// 3. Modify the constants to your liking
// 4. Open chrome dev tools and paste this script or add it as a snippet

(async () => {
  // maximum amount of connection requests
  const MAX_CONNECTIONS = 4;
  // time in ms to wait before requesting to connect
  const WAIT_TO_CONNECT = 3000;
  // time in ms to wait before new employees load after scroll
  const WAIT_AFTER_SCROLL = 3000;
  // message to connect (%EMPLOYEE% and %COMPANY% will be replaced with real values)
  const MESSAGE = `Hi %EMPLOYEE%, I found an open role for “Software Engineer” at %COMPANY% that closely aligns with my interests and I believe I am qualified for the position. Please let me know if you’d be open to a conversation to discuss this position.
  Regards,
  Chirag Mali`;
  // keywords to filter employees in specific positions
  const POSITION_KEYWORDS = [
    "software",
    "developer",
    "full stack",
    "back end",
    "front end",
    "r&d",
    "recruiter",
    "recruiting",
    "Talent",
    "diversity",
    "technical",
    "Human",
    "Engineering",
    "Manager",
  ];

  // <--> //

  const MESSAGE_CHAR_LIMIT = 300;

   function setKeywordText(text) {
    
      setTimeout(function () {
        let el = document.getElementById("custom-message");
        el.value = text;
        let evt = document.createEvent("Events");
        evt.initEvent("change", true, true);
        el.dispatchEvent(evt);
        document.getElementById("custom-message").click();
      }, 1000);
    };

  function buildMessage(employee) {
    const company = document.querySelector(".org-top-card-summary__title")
      .title;

    const replacements = { "%COMPANY%": company, "%EMPLOYEE%": employee };
    const message = MESSAGE.replace(/%\w+%/g, (i) => {
      return replacements[i];
    });
    console.log(message);
    return message.length <= MESSAGE_CHAR_LIMIT ? message : "";
  }

  function getButtonElements() {
    return [
      ...document.querySelectorAll(
        ".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.full-width"
      ),
    ].filter((button) => {
      const cardInnerText = button.offsetParent.innerText.split("\n");
      position = cardInnerText.join(" ");
      return POSITION_KEYWORDS.some((p) => position.match(new RegExp(p, "gi")));
    });
  }

   function fillMessageAndConnect() {
    const employee = document
      .querySelector(".artdeco-modal__content.ember-view")
      .innerText.split(" ")[10];

    //click the button add a note
    console.log(document.querySelector('button[aria-label="Add a note"]'));

    document.querySelector('button[aria-label="Add a note"]').click();
    setKeywordText(buildMessage(employee));
    
    setTimeout(function () {
      
    console.log("sending connection to" + employee);
    document
      .getElementById("artdeco-modal-outlet")
      .getElementsByTagName("button")[2]
      .click();
    console.log(`🤝 Requested connection to ${employee}`);
    }, 2000);
  };
    

  async function connect(button) {
    return new Promise((resolve) => {
      setTimeout(() => {
        button.click();
        fillMessageAndConnect();
        resolve();
      }, WAIT_TO_CONNECT);
    });
  }

  async function* getConnectButtons() {
    while ((buttons = getButtonElements()).length > 0) {
      yield* buttons;
      await loadMoreButtons();
    }
  }

  async function loadMoreButtons() {
    console.log("⏬ Scrolling..");
    await Promise.resolve(window.scrollTo(0, document.body.scrollHeight));
    return new Promise((resolve) => setTimeout(resolve, WAIT_AFTER_SCROLL));
  }

  // <--> //

  console.log("⏳ Started connecting, please wait.");
  try {
    var connections = 0;
    const buttonsGenerator = getConnectButtons();
    while (
      connections < MAX_CONNECTIONS &&
      !(next = await buttonsGenerator.next()).done
    ) {
      const button = next.value;
      await connect(button);
      connections++;
    }
    console.log(
      `✅ Done! Successfully requested connection to ${connections} people.`
    );
  } catch {
    console.log(
      `⛔ Whoops, looks like something went wrong. 
		Please go to https://github.com/mariiio/linkedin_connect and follow the instructions.`
    );
  }
})();
