from xeger import Xeger
import json

serviceRules = []

with open('nmap-service-probes.txt', 'r', encoding='utf-8') as f:
    for i in f:
        rule = {}
        fullString = i
        ruleName = ''
        regexRule = ''
        if(fullString[:5] == 'match'):
            clippedMatch = fullString[6:]
            endRuleName = clippedMatch.find(' ')
            ruleName = clippedMatch[:endRuleName]
            ruleStart = clippedMatch.find('m|')
            regexRule = clippedMatch[ruleStart+2:]
        if(fullString[:9] == 'softmatch'):
            clippedMatch = fullString[10:]
            endRuleName = clippedMatch.find(' ')
            ruleName = clippedMatch[:endRuleName]
            ruleStart = clippedMatch.find('m|')
            regexRule = clippedMatch[ruleStart+2:]
        
        x = Xeger(limit=10)  # default limit = 10
        if(ruleName != ''):
            try:
                print(ruleName)
                header = x.xeger(regexRule)
                if(header == ''):
                    print(regexRule)
                rule['name'] = ruleName
                rule['header'] = str(header)
                serviceRules.append(rule)
            except:
                pass

out = json.dumps(serviceRules)
with open('serviceHeaders.json', 'w') as outfile:
    outfile.write(out)
