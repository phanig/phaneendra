


# LangChain Notes and ReadMe for the language model

## LLM

```python
llm = OpenAI(temprature = 0.1, api_key = api_key)
result = (llm('what is the best desert'))
```
llm takes in a text as an input and gives out the result. You usually give the text from a prompt. (see below)

## prompt templates

easy way to prompt management. Langchain has a promptTemplate class called ```BasePromptTemplate```

Basic PromptTemplate accepts ```input_variables``` and ```template```.  

e.g: 

```python
prompt = PromptTemplate(input_variables = ['food'], template = "what is the best {food}?")
print(prompt.format("desert"))
```

that gives me `what is the best desert?`


## Chain

combines LLMs and prompts in multistep workflows (unlike llms which are just one step)

e.g:

```python
chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run('desert')
```

that gives me results same as `llm(prompt.format('desert))`
 
Note that when we call `chain.run()`, we are giving it the `input_variable` as a parameter.

if you have multiple variables in the prompt, you can give them as a dictionary.
```python
chain.run({
    'company': "ABC Startup",
    'product': "colorful socks"
    }))
```

## Agent

it uses tools like calculators and google search to complete your questions and give an answer. But, we are not using it in our project at avatarx

## Memory

Adds state to Chains and Agents

`ConversationChain` does it by default. It holds memory.

```BufferMemory``` is the most common. It accepts various variables like 
```
{
    memoryKey: 'history',
    chatHistory: new ChatMessageHistory(pastMessages),
    returnMessages: true
}
```

**returnMessages: true makes the memory return a list of chat messages instead of a string.**

where `pastMessages` can be found as follows.

```
const pastMessages = [
  new HumanMessage("My name's Jonas"),
  new AIMessage("Nice to meet you, Jonas!"),
];
```