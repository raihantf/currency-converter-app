import { FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import axios from 'axios'

const app: FastifyInstance = require('fastify')();

interface ConvertRequest {
    from: string;
    to: string;
    amount: number;
}

app.post('/api/convert', async (request: FastifyRequest<{Body: ConvertRequest}>, reply: FastifyReply) => {
    try {
        const {from, to, amount} = request.body

        const response = await axios.get(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`)
        const result = response.data.rates[to]

        if (amount < 0) {
            reply.status(400).send({message: "Invalid amount request"})
        }

        return {message : `${amount} ${from} = ${result} ${to}`}
    } catch (error) {
        return reply.status(500).send({message: "Internal server error"})
    }
})

const Start = async () => {
    try {
        await app.listen({port:8080})
        console.log(`Server running perfectly!`)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}


Start()