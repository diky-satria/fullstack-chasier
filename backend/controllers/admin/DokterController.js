const { sequelize }         = require('../../models/index.js')
const { QueryTypes }        = require('sequelize')
const Models                = require('../../models/index.js')
const { validationResult }  = require('express-validator')

exports.getDokter = async (req, res) => {

    var dokter_query = await sequelize.query(`SELECT * FROM dokters ORDER BY createdAt DESC`, { type: QueryTypes.SELECT })

    return res.json({
        message: 'Semua dokter',
        data: dokter_query  
    })
}

exports.addDokter = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()[0]
        })
    }else{
        
        try {
            const { nama_tambah } = req.body
        
            let response = await Models.dokters.create({
                nama: nama_tambah.toUpperCase(),
            })
        
            return res.status(200).json({
                message: 'Dokter berhasil ditambahkan',
                data: response
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Server error',
            })
        }
    }
}

exports.editDokter = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()[0]
        })
    }else{ 
        
        try {
            const { nama_lama_edit, nama_edit } = req.body
            const { id } = req.params
        
            let response = await Models.dokters.update({
                nama: nama_edit.toUpperCase(),
            },{
                where: {
                    id: id
                }
            })
        
            return res.status(200).json({
                message: 'Dokter berhasil di edit',
                data: response
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Server error',
            }) 
        }
    }
}

exports.destroyDokter = async (req, res) => {
    try {
        const { id } = req.params

        await Models.dokters.destroy({
            where: {
                id: id
            }
        })
        
        return res.status(200).json({
            message: 'Dokter berhasil dihapus',
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
        }) 
    }
}