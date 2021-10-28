export default class Eventable {
  private __eventHandler = new Map();

  /**
   * Dispara los eventos relacionados con el eventHandler X
   * @param {string} eventName Nombre del evento.
   * @param {Array} args Array con parámetros a ser pasados a los event handlers.
   * @return {boolean} Either True if any event handler was executed or False if no event handler was executed.
   */
  public trigger(eventName: string, args: any[]) {
    const event = this.__eventHandler.get(eventName);

    if (!event) {
      // No hay ningún handler para este evento.
      return false;
    }

    for (let i = 0; i < event.length; i++) {
      if (event[i].markedAsDeleted) {
        continue;
      }

      event[i].apply(this, args);
    }

    return true;
  }

  /**
   * Agrega un event handler para determinado tipo de trigger.
   * @param {string} eventName  Nombre del evento.
   * @param {Function} callback Función que procesa el evento.
   * @return {void}
   */
  public on(eventName: string, callback: (...args: any[]) => void) {
    const event = this.__eventHandler.get(eventName);

    if (event) {
      event.push(callback);
    } else {
      this.__eventHandler.set(eventName, [callback]);
    }
  }

  /**
   * Elimina un event handler para determinado tipo de trigger.
   * @param {string} eventName  Nombre del evento.
   * @param {Function} callback Función a eliminar. Si es nulo se eliminan todos los callbacks.
   * @return {void}
   */
  public off(eventName: string, callback: (...args: any[]) => void) {
    const event = this.__eventHandler.get(eventName);

    if (!event) {
      return;
    }

    // Elimina la función del array
    if (callback) {
      const i = event.indexOf(callback);
      if (i !== -1) {
        // Se marca como borrado para no ejecutarlo en el for de la función "trigger".
        // Después se elimina en el setTimeout.
        event[i].markedAsDeleted = true;

        event.splice(i, 1);
      }
    } else {
      this.__eventHandler.delete(eventName);
    }
  }
}
