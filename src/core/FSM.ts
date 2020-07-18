export default class FSM {
  private transitions: any;
  private dataStorage: any;

  private currentState: any;
  private event: any;
  private nextState: any;

  private defaultErrorState: any;
  private defaultErrorCallback: any;

  private initialState: string;
  private initialEvent: string;
  private lastState: string;

  constructor() {
    this.transitions = {};
    this.dataStorage = {};
    
    this.currentState = undefined;
    this.event = undefined;
    this.nextState = undefined;
    
    this.defaultErrorState = undefined;
    this.defaultErrorCallback = undefined;
    
    this.initialState = 'start';
    this.initialEvent = 'default';
    this.lastState = undefined;
  }
  
  setInitialState(stateName: string) {
    this.initialState = stateName;
  }
  
  setInitialEvent(eventName: string) {
    this.initialEvent = eventName;
  }
  
  setLastState(stateName: string) {
    this.lastState = stateName;
  }
  
  addState(transitionName: string) {
    this.transitions[transitionName] = {};
    this.currentState = transitionName;
    return this;
  }
  
  onEvent(eventName: string) {
    this.event = eventName;
    return this;
  }
  
  goTo(stateName: string) {
    if (!this.currentState) {
      throw new Error('Es necesario agregar un estado antes!');
    }
    this.nextState = stateName;
    return this;
  }
  
  do(callback: Function = null) {
    if (!this.nextState) {
      throw new Error('Es necesario agregar una transicion antes!');
    }
    this.transitions[this.currentState][this.event] = [this.nextState, callback];
    return this;
  }
  
  static nothing(data) {
    return [data, null];
  }
  
  doNothing() {
    if (!this.nextState) {
      throw new Error('Es necesario agregar una transición antes!');
    }
    
    this.transitions[this.currentState][this.event] = [this.nextState, FSM.nothing];
    return this;
  }
  
  getNextAction(state: string, event: string) {
    if (!(state in this.transitions)) {
      throw new Error(`Estado ${state} no declarado.`);
    }
    
    // RGR: En caso de no existir el evento en nuestro estado buscamos
    // la existencia de un estado por defecto. De no existir se hace
    // levantamos error y evitamos un posible loop infinito.
    if (!(event in this.transitions[state])) {
      if ('default' in this.transitions[state]) {
        return this.transitions[state].default;
      }
      
      throw new Error(`Evento ${event} no declarado en estado ${state}.`);
    }
    
    return this.transitions[state][event];
  }
  
  setDefaultError(node: string, callback: Function = null) {
    this.defaultErrorState = node;
    this.defaultErrorCallback = callback;
    
    return this;
  }
  
  doDefaultError() {
    this.transitions[this.currentState][this.event] = [
      this.defaultErrorState,
      this.defaultErrorCallback,
    ];
    
    return this;
  }
  
  async run(initialData: any) {
    this.dataStorage = {
      ...initialData,
    };
    
    let state: string = this.initialState;
    let event: string = this.initialEvent;
    let newData: any;
    let callback: Function;
    
    while (state !== this.lastState) {
      // Recupera el siguiente estado y la acción a ejecutar 
      // dado el estado y evento actual
      [state, callback] = this.getNextAction(state, event);
      
      try {
        // eslint-disable-next-line no-await-in-loop
        [newData, event] = await callback(this.dataStorage);
        this.dataStorage = { ...newData };
      } catch (err) {
        if (this.defaultErrorCallback) {
          // eslint-disable-next-line no-await-in-loop
          await this.defaultErrorCallback(this.dataStorage);
        }
        throw err;
      }
    }
    
    return this.dataStorage;
  }
};
