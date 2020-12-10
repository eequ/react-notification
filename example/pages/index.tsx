import notification from "@eequ/notification";

function simpleFn() {
  notification.success({
    message: "Sample notification",
    duration: 3,
    content: <span>Autocloses after 3 seconds, hover to prevent</span>,
  });
}

function durationFn() {
  notification.error({
    message: "This can not be closed",
    duration: null,
    closable: false,
  });
}

function closableFn() {
  notification.info({
    message: <span>closable</span>,
    duration: null,
    onClose: () => {
      console.log("Closed");
    },
    onClick: () => {
      console.log("Clicked");
    },
  });
}

function manualClose() {
  const key = Date.now().toString();

  notification.warning({
    message: "Manual close notification",
    content: (
      <>
        <p>Click button to close</p>

        <button type="button" onClick={() => notification.close(key)}>
          close
        </button>
      </>
    ),
    key,
    closable: false,
    duration: null,
  });
}

const Index = () => {
  return (
    <div>
      <button type="button" onClick={simpleFn}>
        simple show
      </button>
      <button type="button" onClick={durationFn}>
        duration=0
      </button>
      <button type="button" onClick={closableFn}>
        closable
      </button>
      <button type="button" onClick={manualClose}>
        controlled close
      </button>
    </div>
  );
};

export default Index;
