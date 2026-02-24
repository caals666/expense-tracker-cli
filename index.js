#! /usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'data.json');

if(!fs.existsSync(filepath)){
    fs.writeFileSync(filepath, JSON.stringify([],null,2));
}

const data=fs.readFileSync(filepath,'utf8');
let jsonData=JSON.parse(data);

const now=new Date();
program
    .version('1.0.0')
    .description('A simple CLI expense tracker application');

program
    .command('clear')
    .description('Clear all expenses')
    .action(()=>{
        try {
        fs.writeFileSync(filepath, JSON.stringify([], null, 2));
        console.log('All expenses cleared');
        } catch (e) {
        console.error('Failed to clear expenses:', e && e.message ? e.message : e);
        }
        process.exit(0);
    });
    
program.command('add')
    .description('Add a new expense')
    .option('-d, --description <description>', 'Description of the expense')
    .option('-a, --amount <amount>', 'Amount of the expense')
    .action((options)=>{
    if (options.description!==undefined && options.amount!==undefined) {
        const id = jsonData.length + 1;
        const amount = Number(options.amount);
        jsonData.push({ id: id, description: options.description, amount: amount, createdAt: now.toLocaleString(), updatedAt: now.toLocaleString() });
        fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2));
        console.log(`Expense added successfully (ID: ${id})`);
    } else {
        console.error('Missing required options: --description and --amount');
        process.exit(1);
    }
});

program
    .command('list')
    .description('List all expenses')
    .action(()=>{
    try{
        let sum=0;
        console.log(`ID\tDate\tDescription\tAmount`);
        for(let x of jsonData){
            console.log(`${x.id}\t${x.createdAt}\t${x.description}\t${x.amount}`);
        }
    }
    catch(e){
        console.error(e);
    }
})
program
    .command('total')
    .description('Calculate total expenses')
    .option('--month <month>', 'Calculate total for a specific month (1-12)')
    .action((options)=>{
    try{
        if(program.month!==undefined){
            for(let x of jsonData){
            const date=new Date(x.createdAt);
            const month=date.getMonth()+1;
            if(month==options.month){
                    sum+=x.amount;
                }
            }
        console.log(`Total expense for ${date.toLocaleString('default',{month:"Long"})}: ${sum}`);  
        }
        else{
            let sum=0;
            for(let x of jsonData){
                sum+=x.amount;
            }
            console.log(`Total expense: ${sum}`);
        }
    }
    catch(e){
        console.error(e);
    }
});
program
    .command('delete')
    .description('Delete an expense by ID')
    .option('--id <id>', 'ID of the expense to delete')
    .action((options)=>{
    try{
        jsonData = jsonData.filter(x => x.id !== options.id);
        fs.writeFileSync(filepath,JSON.stringify(jsonData,null,2));
        console.log("Expense deleted successfully");
    }
    catch(e){
        console.log("Unable to do it");
    }
});

program.parse();