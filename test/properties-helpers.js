/* eslint no-param-reassign: "off" */

export const canSetDefaultProperties = (context, done) => {
  context.appEl.appendChild(context.testEl);

  const el = document.getElementById('test');

  Promise.resolve().then(() => {
    expect(el.username).toBe(el.constructor.properties.username.value);
    expect(el.signinAttempts).toBe(el.constructor.properties.signinAttempts.value);
    expect(el.valid).toBe(el.constructor.properties.valid.value);
    expect(el.items).toEqual(el.constructor.properties.items.value);
    expect(el.info).toEqual(el.constructor.properties.info.value);

    done();
  });
};

export const canSetStringProperty = (context, done, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }

  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.getAttribute(attrName)).toBe(context.value);
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetNumberProperty = (context, done, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.getAttribute(attrName)).toBe(`${context.value}`);
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetBooleanProperty = (context, done, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.hasAttribute(attrName)).toBe(context.value);
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetArrayProperty = (context, done, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetObjectProperty = (context, done, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetStringPropertyFromAttribute = (context, done) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, context.value);

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.getAttribute(attrName)).toBe(context.value);
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetNumberPropertyFromAttribute = (context, done) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, context.value);

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.getAttribute(attrName)).toBe(`${context.value}`);
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetBooleanPropertyFromAttribute = (context, done) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  if (context.value) {
    context.testEl.setAttribute(attrName, '');
  } else {
    context.testEl.removeAttribute(attrName);
  }

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toBe(context.value);
    expect(el.hasAttribute(attrName)).toBe(context.value);
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetArrayPropertyFromAttribute = (context, done) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, JSON.stringify(context.value));

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toEqual(context.value);
    expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};

export const canSetObjectPropertyFromAttribute = (context, done) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, JSON.stringify(context.value));

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  Promise.resolve().then(() => {
    expect(el[context.propName]).toEqual(context.value);
    expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
    expect(el[observerName].calls.count()).toBe(1);
    expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);

    done();
  });
};
