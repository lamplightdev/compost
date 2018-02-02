export const canSetDefaultProperties = (context) => {
  context.appEl.appendChild(context.testEl);

  const el = document.getElementById('test');

  expect(el.username).toBe(el.constructor.properties.username.value);
  expect(el.signinAttempts).toBe(el.constructor.properties.signinAttempts.value);
  expect(el.valid).toBe(el.constructor.properties.valid.value);
  expect(el.items).toEqual(el.constructor.properties.items.value);
  expect(el.info).toEqual(el.constructor.properties.info.value);
};

export const canSetStringProperty = (context, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }

  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.getAttribute(attrName)).toBe(context.value);
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetNumberProperty = (context, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.getAttribute(attrName)).toBe(`${context.value}`);
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetBooleanProperty = (context, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.hasAttribute(attrName)).toBe(context.value);
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetArrayProperty = (context, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetObjectProperty = (context, append = true) => {
  context.testEl[context.propName] = context.value;

  if (append) {
    context.appEl.appendChild(context.testEl);
  }
  const el = document.getElementById('test');

  const attrName = el.constructor.propertyNameToAttributeName(context.propName);
  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetStringPropertyFromAttribute = (context) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, context.value);

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.getAttribute(attrName)).toBe(context.value);
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetNumberPropertyFromAttribute = (context) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, context.value);

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.getAttribute(attrName)).toBe(`${context.value}`);
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetBooleanPropertyFromAttribute = (context) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  if (context.value) {
    context.testEl.setAttribute(attrName, '');
  } else {
    context.testEl.removeAttribute(attrName);
  }

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toBe(context.value);
  expect(el.hasAttribute(attrName)).toBe(context.value);
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetArrayPropertyFromAttribute = (context) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, JSON.stringify(context.value));

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toEqual(context.value);
  expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};

export const canSetObjectPropertyFromAttribute = (context) => {
  const attrName = context.testEl.constructor.propertyNameToAttributeName(context.propName);

  context.testEl.setAttribute(attrName, JSON.stringify(context.value));

  const el = document.getElementById('test');

  const observerName = el.constructor.properties[context.propName].observer;

  expect(el[context.propName]).toEqual(context.value);
  expect(el.getAttribute(attrName)).toBe(JSON.stringify(context.value));
  expect(el[observerName].calls.count()).toBe(1);
  expect(el[observerName]).toHaveBeenCalledWith(context.previousValue, context.value);
};
