# Anima-DiscordBot

## 1.Create config in your project
Create file `config.json` in folder `Data`
In config should be:
```json
{
  "token": "YOUR_TOKEN",
  "clientId": "YOUR_BOT_ID",
  "apiKey": "YOUR_GPT3_API_KEY",
}
```
  If you have free gpt api key, <br>
  if not, you can remove this line and event 'gptEvent'

### DATABASE:
```sql
CREATE TABLE users (
  ID BIGINT NOT NULL,
  user VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  xp INT NOT NULL,
  coin INT NOT NULL,
  PRIMARY KEY (ID)
);
```