const { sequelize }         = require('../../models/index.js')
const { QueryTypes }        = require('sequelize')
const Models                = require('../../models/index.js')
const { validationResult }  = require('express-validator')

exports.getBarang = async (req, res) => {

    var barang_query = await sequelize.query(`SELECT * FROM barangs ORDER BY createdAt DESC`, { type: QueryTypes.SELECT })

    return res.json({
        message: 'Semua barang',
        data: barang_query  
    })
}

exports.addBarang = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()[0]
        })
    }else{
        
        try {
            const { nama_tambah } = req.body
        
            let response = await Models.barangs.create({
                nama: nama_tambah.toUpperCase(),
            })
        
            return res.status(200).json({
                message: 'Barang berhasil ditambahkan',
                data: response
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Server error',
            })
        }
    }
}

exports.editBarang = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()[0]
        })
    }else{ 
        
        try {
            const { nama_lama_edit, nama_edit } = req.body
            const { id } = req.params
        
            let response = await Models.barangs.update({
                nama: nama_edit.toUpperCase(),
            },{
                where: {
                    id: id
                }
            })
        
            return res.status(200).json({
                message: 'Barang berhasil di edit',
                data: response
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Server error',
            }) 
        }
    }
}

exports.destroyBarang = async (req, res) => {
    try {
        const { id } = req.params

        await Models.barangs.destroy({
            where: {
                id: id
            }
        })
        
        return res.status(200).json({
            message: 'Barang berhasil dihapus',
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
        }) 
    }
}